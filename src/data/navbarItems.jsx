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
    to: '/products'
  },
];

export default getNavbarItems;