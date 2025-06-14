const getNavbarItems = (t) => [
  { label: t.goInicio, title: t.goHome, to: '/' },
  {
    label: t.products,
    title: t.goProducts,
    children: [
      { label: 'Producto 1', title: 'Ver Producto 1', to: '/products/1' },
      { label: 'Producto 2', title: 'Ver Producto 2', to: '/products/2' },
    ],
  },
  {
    label: t.categories,
    title: t.goCategories,
    to: '/categories',
    children: [
      { label: 'Categoría A', title: 'Ver Categoría A', to: '/categories/a' },
      { label: 'Categoría B', title: 'Ver Categoría B', to: '/categories/b' },
    ],
  },
];

export default getNavbarItems;