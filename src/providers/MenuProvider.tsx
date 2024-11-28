import React, { useContext, useState } from 'react'

export const MenuContext = React.createContext<{
  menuContext: { drawerOpen: boolean }
  menuContextHandler: (state: any) => void
}>({
  menuContext: { drawerOpen: false },
  menuContextHandler: (state: any) => {},
})

const initialState = {
  drawerOpen: false,
}

export const MenuProvider = (props: any) => {
  const [menuContext, setMenuContext] = useState<{ drawerOpen: boolean }>(initialState)

  const _menuContextHandler = (state: { drawerOpen: boolean }) => {
    setMenuContext(!state ? initialState : { ...menuContext, ...state })
  }

  return (
    <MenuContext.Provider
      value={{
        menuContext: menuContext,
        menuContextHandler: _menuContextHandler,
      }}
    >
      {props.children}
    </MenuContext.Provider>
  )
}

export const useMenuContext = () => useContext(MenuContext)
