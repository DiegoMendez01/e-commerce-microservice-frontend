const getNavbarItems = (t) => [
  { label: t.goInicio, title: t.goHome, to: '/' },
  {
    label: t.categories,
    title: t.goCategories,
    to: '/categories'
  },
  {
    label: t.products,
    title: t.goProducts,
    children: [
      { label: 'Producto 1', title: 'Ver Producto 1', to: '/products/1' },
      { label: 'Producto 2', title: 'Ver Producto 2', to: '/products/2' },
    ],
  },
];

export default getNavbarItems;