'use client';
import { useMemo, useRef, useState } from 'react';
import { productsV3 } from '@wix/stores';
import { TeeMockup, PRINT, isDark } from '@app/components/Tee/TeeMockup';
import { Quantity } from '@app/components/Quantity/Quantity';
import { useUI } from '@app/components/Provider/context';
import { useAddItemToCartAsync } from '@app/hooks/useAddItemToCart';
import { STORES_APP_ID } from '@app/constants';

type Art = { src: string; w: number; h: number; srcW: number; srcH: number };
type Xf = { x: number; y: number; s: number; r: number };

const MAX_SIDE = 1600;
const MAX_UPLOAD = 3.8 * 1024 * 1024;
const START: Xf = { x: 0, y: 0, s: 1, r: 0 };
const FALLBACK_COLOR = '#f1f0ea';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = src;
  });

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export function Studio({
  product,
  slug,
  embedded = false,
}: {
  product: productsV3.V3Product | null;
  slug: string;
  embedded?: boolean;
}) {
  const { openSidebar } = useUI();
  const addItem = useAddItemToCartAsync();
  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(
    null
  );

  const [art, setArt] = useState<Art | null>(null);
  const [xf, setXf] = useState<Xf>(START);
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const first: Record<string, string> = {};
    (product?.options ?? []).forEach((option: any) => {
      const name = option.choicesSettings?.choices?.[0]?.name;
      if (name) first[option.name] = name;
    });
    return first;
  });
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);

  const options = ((product?.options ?? []) as any[]).filter(
    (o) => o.choicesSettings?.choices?.length
  );

  const variant = useMemo(() => {
    const variants = product?.variantsInfo?.variants ?? [];
    if (!options.length) return variants[0];
    if (Object.keys(selected).length < options.length) return undefined;
    return variants.find((v) =>
      v.choices?.every(
        (c) =>
          selected[c.optionChoiceNames?.optionName ?? ''] ===
          c.optionChoiceNames?.choiceName
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, selected]);

  const colorOption = options.find((o) =>
    ['SWATCH_CHOICES', 'COLOR_CHOICES'].includes(o.optionRenderType)
  );
  const teeColor =
    colorOption?.choicesSettings?.choices?.find(
      (c: any) => c.name === selected[colorOption.name]
    )?.colorCode ?? FALLBACK_COLOR;

  const modifiers = ((product as any)?.modifiers ?? []) as any[];
  const findMod = (label: string) =>
    modifiers.find(
      (m) =>
        m.modifierRenderType === 'FREE_TEXT' &&
        String(m.name).toLowerCase().includes(label)
    );
  const fileMod = findMod('design file');
  const previewMod = findMod('design preview');
  const placeMod = findMod('placement');

  const issues: string[] = [];
  if (!product) issues.push(`No product with the slug "${slug}" was found.`);
  if (product && !fileMod) issues.push('Missing free-text field: Design file');
  if (product && !previewMod)
    issues.push('Missing free-text field: Design preview');
  if (product && !placeMod) issues.push('Missing free-text field: Placement');

  const inStock = variant ? variant.inventoryStatus?.inStock !== false : false;
  const price =
    variant?.price?.actualPrice?.formattedAmount ??
    product?.actualPriceRange?.minValue?.formattedAmount ??
    '';
  const ready = !!art && !!variant && inStock && !issues.length && !busy;

  const fit = art ? Math.min(PRINT.w / art.w, PRINT.h / art.h) : 1;
  const dw = art ? art.w * fit * xf.s : 0;
  const dh = art ? art.h * fit * xf.s : 0;
  const cx = PRINT.x + PRINT.w / 2 + xf.x;
  const cy = PRINT.y + PRINT.h / 2 + xf.y;
  const lowRes = !!art && Math.max(art.srcW, art.srcH) < 900;

  const move = (dx: number, dy: number) =>
    setXf((t) => ({
      ...t,
      x: clamp(t.x + dx, -PRINT.w / 2, PRINT.w / 2),
      y: clamp(t.y + dy, -PRINT.h / 2, PRINT.h / 2),
    }));

  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  const onDown = (e: React.PointerEvent) => {
    if (!art) {
      fileRef.current?.click();
      return;
    }
    (e.target as Element).setPointerCapture(e.pointerId);
    const p = toSvg(e);
    drag.current = { px: p.x, py: p.y, x: xf.x, y: xf.y };
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const p = toSvg(e);
    setXf((t) => ({
      ...t,
      x: clamp(
        drag.current!.x + p.x - drag.current!.px,
        -PRINT.w / 2,
        PRINT.w / 2
      ),
      y: clamp(
        drag.current!.y + p.y - drag.current!.py,
        -PRINT.h / 2,
        PRINT.h / 2
      ),
    }));
  };

  const endDrag = () => {
    drag.current = null;
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const keys: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (art && keys[e.key]) {
      e.preventDefault();
      move(...keys[e.key]);
    }
  };

  const loadFile = async (file?: File) => {
    if (!file) return;
    setError('');
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setError('Use a PNG, JPG or WebP image.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('That image is over 25 MB. Try a smaller file.');
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const k = Math.min(
        1,
        MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight)
      );
      const w = Math.round(img.naturalWidth * k);
      const h = Math.round(img.naturalHeight * k);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      const jpeg = file.type === 'image/jpeg';
      setArt({
        src: canvas.toDataURL(jpeg ? 'image/jpeg' : 'image/png', 0.92),
        w,
        h,
        srcW: img.naturalWidth,
        srcH: img.naturalHeight,
      });
      setXf(START);
    } catch (e) {
      setError('We could not read that image.');
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const exportArt = async () => {
    const img = await loadImage(art!.src);
    for (const k of [6, 4, 3, 2]) {
      const canvas = document.createElement('canvas');
      canvas.width = PRINT.w * k;
      canvas.height = PRINT.h * k;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width / 2 + xf.x * k, canvas.height / 2 + xf.y * k);
      ctx.rotate((xf.r * Math.PI) / 180);
      ctx.drawImage(img, (-dw * k) / 2, (-dh * k) / 2, dw * k, dh * k);
      const blob = await toBlob(canvas, 'image/png');
      if (blob && blob.size <= MAX_UPLOAD) return blob;
    }
    throw new Error(
      'This design is too detailed to upload. Try a smaller image.'
    );
  };

  const exportPreview = async () => {
    const clone = svgRef.current!.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll('[data-guide]').forEach((n) => n.remove());
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '600');
    bg.setAttribute('height', '640');
    bg.setAttribute('fill', '#e3e7de');
    clone.insertBefore(bg, clone.firstChild);
    clone.setAttribute('width', '800');
    clone.setAttribute('height', '853');
    const xml = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(
      new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
    );
    try {
      const img = await loadImage(url);
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 853;
      canvas.getContext('2d')!.drawImage(img, 0, 0, 800, 853);
      const blob = await toBlob(canvas, 'image/jpeg', 0.88);
      if (!blob) throw new Error('Could not render the preview.');
      return blob;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const upload = async (blob: Blob, kind: 'art' | 'preview', ext: string) => {
    const body = new FormData();
    body.append(
      'file',
      new File([blob], `${kind}.${ext}`, { type: blob.type })
    );
    body.append('kind', kind);
    const res = await fetch('/api/upload-design', { method: 'POST', body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed.');
    return data.url as string;
  };

  const addToCart = async () => {
    if (!ready || !product || !variant) return;
    setError('');
    try {
      setBusy('Preparing your design…');
      const [artBlob, previewBlob] = await Promise.all([
        exportArt(),
        exportPreview(),
      ]);
      setBusy('Uploading…');
      const [artUrl, previewUrl] = await Promise.all([
        upload(artBlob, 'art', 'png'),
        upload(previewBlob, 'preview', 'jpg'),
      ]);
      const placement = `Front | offset ${(xf.x / PRINT.w).toFixed(2)},${(
        xf.y / PRINT.h
      ).toFixed(2)} | scale ${xf.s.toFixed(2)} | rotate ${Math.round(xf.r)}`;
      const fields = [
        [fileMod, artUrl],
        [previewMod, previewUrl],
        [placeMod, placement],
      ] as [any, string][];
      for (const [mod, value] of fields) {
        const max = mod.freeTextSettings?.maxCharCount;
        if (max && value.length > max) {
          throw new Error(
            `The "${mod.name}" field allows ${max} characters. Raise its limit in Wix.`
          );
        }
      }
      setBusy('Adding to cart…');
      await addItem({
        quantity: qty,
        catalogReference: {
          catalogItemId: product._id!,
          appId: STORES_APP_ID,
          options: {
            variantId: variant._id,
            customTextFields: Object.fromEntries(
              fields.map(([mod, value]) => [mod.freeTextSettings.key, value])
            ),
          },
        },
      });
      openSidebar();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setBusy('');
    }
  };

  const slider =
    'w-full accent-[#2e4a40] disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="container-x pt-8 sm:pt-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-6xl">
          {embedded ? product?.name : 'Design your tee'}
        </h1>
        <p className="mt-4 text-lg opacity-80">
          Upload an image, place it on the product and order. We print the exact
          file you place.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr] items-start">
        <div
          className={`rounded-[14px] bg-[#e3e7de] p-3 sm:p-8 outline-offset-2 ${
            over ? 'outline outline-2 outline-dashed outline-[#2e4a40]' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            loadFile(e.dataTransfer.files?.[0]);
          }}
          tabIndex={0}
          onKeyDown={onKey}
          aria-label="Shirt preview. Use the arrow keys to move your image."
        >
          <TeeMockup
            ref={svgRef}
            color={teeColor}
            guide
            className="w-full h-auto max-w-[640px] mx-auto select-none touch-none"
          >
            {art ? (
              <image
                href={art.src}
                x={-dw / 2}
                y={-dh / 2}
                width={dw}
                height={dh}
                preserveAspectRatio="none"
                transform={`translate(${cx} ${cy}) rotate(${xf.r})`}
              />
            ) : (
              <g data-guide="true" pointerEvents="none">
                <text
                  x={PRINT.x + PRINT.w / 2}
                  y={PRINT.y + PRINT.h / 2 - 4}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="600"
                  fill={isDark(teeColor) ? '#ffffff' : '#17231f'}
                  opacity="0.75"
                >
                  Drop your image here
                </text>
                <text
                  x={PRINT.x + PRINT.w / 2}
                  y={PRINT.y + PRINT.h / 2 + 18}
                  textAnchor="middle"
                  fontSize="12"
                  fill={isDark(teeColor) ? '#ffffff' : '#17231f'}
                  opacity="0.55"
                >
                  or click to browse
                </text>
              </g>
            )}
            <rect
              data-guide="true"
              x={PRINT.x}
              y={PRINT.y}
              width={PRINT.w}
              height={PRINT.h}
              fill="transparent"
              style={{ cursor: art ? 'grab' : 'pointer' }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          </TeeMockup>
        </div>

        <div className="flex flex-col gap-7">
          <div>
            <h2 className="text-lg mb-3">Artwork</h2>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                loadFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-main"
                onClick={() => fileRef.current?.click()}
              >
                {art ? 'Replace image' : 'Upload image'}
              </button>
              {art ? (
                <>
                  <button
                    type="button"
                    className="btn-line"
                    onClick={() => setXf(START)}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn-line"
                    onClick={() => setArt(null)}
                  >
                    Remove
                  </button>
                </>
              ) : null}
            </div>
            <p className="mt-3 text-sm opacity-70">
              PNG, JPG or WebP. Transparent PNGs print best. You can also drop a
              file on the shirt.
            </p>
            {lowRes ? (
              <p className="mt-3 text-sm text-[#8a5a00]">
                This image is small and may print soft. Try one that is at least
                900 px on its longest side.
              </p>
            ) : null}
          </div>

          <div className="grid gap-4">
            <label className="text-sm font-medium">
              Size on shirt
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.01"
                value={xf.s}
                disabled={!art}
                onChange={(e) => setXf({ ...xf, s: Number(e.target.value) })}
                className={slider}
              />
            </label>
            <label className="text-sm font-medium">
              Rotate
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={xf.r}
                disabled={!art}
                onChange={(e) => setXf({ ...xf, r: Number(e.target.value) })}
                className={slider}
              />
            </label>
            <p className="text-sm opacity-70">
              Drag the image on the shirt to move it. Arrow keys nudge it.
            </p>
          </div>

          {options.map((option) => {
            const swatch = ['SWATCH_CHOICES', 'COLOR_CHOICES'].includes(
              option.optionRenderType
            );
            return (
              <div key={option.name}>
                <h2 className="text-lg mb-3">
                  {option.name}
                  <span className="ml-2 text-sm font-normal opacity-70">
                    {selected[option.name]}
                  </span>
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {option.choicesSettings.choices.map((choice: any) => {
                    const active = selected[option.name] === choice.name;
                    return swatch ? (
                      <button
                        key={choice.name}
                        type="button"
                        aria-label={choice.name}
                        aria-pressed={active}
                        onClick={() =>
                          setSelected({
                            ...selected,
                            [option.name]: choice.name,
                          })
                        }
                        className={`w-9 h-9 rounded-full border border-black/15 ring-offset-2 ring-offset-[#f5f6f1] ${
                          active ? 'ring-2 ring-[#2e4a40]' : ''
                        }`}
                        style={{ backgroundColor: choice.colorCode }}
                      />
                    ) : (
                      <button
                        key={choice.name}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          setSelected({
                            ...selected,
                            [option.name]: choice.name,
                          })
                        }
                        className={`min-w-[44px] px-3 h-10 rounded-full border text-sm ${
                          active
                            ? 'bg-[#2e4a40] text-[#f5f6f1] border-[#2e4a40]'
                            : 'border-[color:var(--line)]'
                        }`}
                      >
                        {choice.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="border-t border-[color:var(--line)] pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-default text-2xl">{price}</span>
              <Quantity
                value={qty}
                max={99}
                handleChange={(e) =>
                  setQty(Math.max(1, Number(e.target.value)))
                }
                increase={() => setQty(qty + 1)}
                decrease={() => setQty(Math.max(1, qty - 1))}
              />
            </div>
            <button
              type="button"
              className="btn-main w-full !py-4"
              disabled={!ready}
              onClick={addToCart}
            >
              {busy || (variant && !inStock ? 'Out of stock' : 'Add to cart')}
            </button>
            <p className="mt-3 text-sm opacity-70" aria-live="polite">
              {!art ? 'Upload an image to continue.' : ''}
            </p>
            {error ? (
              <p className="mt-2 text-sm text-[#a3261a]" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          {issues.length ? (
            <div className="rounded-[10px] border border-[color:var(--line)] p-4 text-sm">
              <p className="font-medium mb-1">Setup needed in Wix</p>
              <ul className="list-disc pl-5 opacity-80">
                {issues.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
