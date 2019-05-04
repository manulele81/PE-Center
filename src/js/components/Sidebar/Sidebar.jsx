import React, { useContext } from 'react'
import Drawer from '@material-ui/core/Drawer'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Avatar from '@material-ui/core/Avatar'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import { DefaultContext } from '@/js/stores/DefaultContext'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import { TOGGLE_SIDEBAR, SELECT_PRODUCTS } from '@/js/stores/reducer/constants'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { SettingsContext } from '@/js/stores/SettingsContext'

const ToolbarClosed = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 52px;
`

function Sidebar() {
  const [{ isOpenSidebar }, dispatchDefault] = useContext(DefaultContext)
  const [{ productsSelected }, dispatchSettings] = useContext(SettingsContext)

  const closeSidebar = () =>
    dispatchDefault({
      type: TOGGLE_SIDEBAR,
      isOpenSidebar: false
    })

  const handleFilter = productId => {
    const newProductsSelected = [...productsSelected]
    const productIndex = newProductsSelected.findIndex(p => p.id === productId)
    const product = { ...newProductsSelected[productIndex], visible: !newProductsSelected[productIndex].visible }
    newProductsSelected[productIndex] = product
    dispatchSettings({
      type: SELECT_PRODUCTS,
      productsSelected: newProductsSelected
    })
  }

  return (
    <ClickAwayListener onClickAway={closeSidebar} mouseEvent={isOpenSidebar ? 'onClick' : false}>
      <Drawer variant="persistent" anchor="left" open={isOpenSidebar}>
        <ToolbarClosed>
          <IconButton onClick={closeSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </ToolbarClosed>
        <Divider />
        <FormGroup>
          {productsSelected.map(product => (
            <FormControlLabel
              style={{ padding: '0 10px' }}
              key={product.id}
              control={<Checkbox checked={product.visible} onChange={() => handleFilter(product.id)} />}
              label={product.name}
            />
          ))}
        </FormGroup>
      </Drawer>
    </ClickAwayListener>
  )
}

export default Sidebar
