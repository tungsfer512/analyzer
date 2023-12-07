// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser, groupMenu } = initialState || {};
  console.log('Access controll: ', currentUser, groupMenu);
  return {
    isAdmin: currentUser && currentUser.access === 'admin',
    isGuest: currentUser && currentUser.access === 'guest',
    canReadFoo: true,
    permisionMenu: (route: any) => {
      let a = groupMenu;
      let flag = false;
      groupMenu?.menus?.map((item) => {
        if (item === route.maChucNang) {
          flag = true;
        }
      });
      return flag;
    },
    // Using like below to define access controll in route.ts file
    protectedRouteForAdmin: (route: any) => {
      console.log('Route for access controll: ', route);
      return route.name === 'Product Management';
    },
  };
}
