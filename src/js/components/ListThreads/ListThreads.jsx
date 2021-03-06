import React from 'react'
import List from '@material-ui/core/List'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import ListSubheader from '@material-ui/core/ListSubheader'
import { useTranslation } from 'react-i18next'
import Thread from './Thread'

const StyledList = styled(List)`
  width: 100%;
  display: block;

  && {
    padding: 0;
  }

  .list-by-product > div:first-child {
    background-color: ${props => props.background.default};
  }
`

const TitleProduct = styled(ListSubheader)`
  && {
    padding: 0;
  }

  & > div {
    padding: 7px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
`

const AvatarProduct = styled(Avatar)`
  && {
    border: 1px solid rgba(255, 255, 255, 0.75);
    margin-right: 12px;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    width: 20px;
    height: 20px;

    img {
      width: 70%;
      height: 70%;
    }
  }
`

function ListThreads({ threads, theme }) {
  const { t } = useTranslation()

  return (
    <StyledList background={theme.palette.background} dense>
      {threads.map(item => (
        <li key={`product-${item.product.id}-${item.lang}`} style={{ display: item.product.visible ? 'block' : 'none' }}>
          <div className="list-by-product">
            <TitleProduct component="div">
              <div>
                <div>
                  <AvatarProduct alt={item.product.name} src={`/images/products/${item.product.icon}`} />
                  <Typography component="span" variant="body2" style={{ lineHeight: 1.1, fontWeight: 'normal' }}>
                    {item.product.name}
                  </Typography>
                </div>
                <div>
                  <Typography component="span">{t('subheaderThread')}</Typography>
                </div>
              </div>
              <Divider />
            </TitleProduct>
            {item.threads.map(thread => (
              <Thread {...thread} key={`thread-${thread.uuid}`} />
            ))}
          </div>
        </li>
      ))}
    </StyledList>
  )
}

export default withStyles(null, { withTheme: true })(ListThreads)
