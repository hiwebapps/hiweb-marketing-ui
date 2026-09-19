/**
 * Insert menu for landing-page sections (page builder).
 * Grid thumbnails live in /static/section-previews/.
 */
export const sectionInsertMenu = {
  filter: true,
  views: [
    {
      name: 'grid' as const,
      previewImageUrl: (schemaTypeName: string) =>
        `/static/section-previews/${schemaTypeName}.svg`,
    },
    { name: 'list' as const },
  ],
};
