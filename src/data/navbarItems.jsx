const getNavbarItems = (t, totalItems = 0) => [
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
  {
    label: t.customers,
    title: t.goCustomers,
    to: '/customers'
  },
  {
    label: `${t.cartNavbar}${totalItems > 0 ? ` (${totalItems})` : ''}`,
    title: t.goCart,
    to: '/cart'
  },
];

export default getNavbarItems;