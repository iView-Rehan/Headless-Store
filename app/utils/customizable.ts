export const isCustomizable = (product: any) =>
  ((product?.modifiers ?? []) as any[]).some(
    (m) =>
      m.modifierRenderType === 'FREE_TEXT' &&
      String(m.name).toLowerCase().includes('design file')
  );
