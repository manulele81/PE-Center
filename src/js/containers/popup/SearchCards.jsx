import React, { useContext, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import ListCards from '@components/ListCards/ListCards'
import CircularProgress from '@material-ui/core/CircularProgress'
import { DefaultContext } from '@/js/stores/DefaultContext'
import { SET_CARDS, REMOVE_CARDS, SET_SEARCHING_STATUS } from '@/js/stores/reducer/constants'
import { wait } from '@utils/utils'
import { searchCards } from '@shared/api/Card.api'
import useSearchParams from '@shared/hooks/useSearchParams'
import Button from '@material-ui/core/Button'
import { useSettings } from '@/js/stores/SettingsContext'
import Typography from '@material-ui/core/Typography'
import { IllusTab } from '@containers/PopupContainer'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'

const Loader = styled.div`
  display: inline-block;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
`

const Warning = styled.div`
  padding: 13px 15px;
  text-align: center;
`

const ViewMore = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`

export function SearchCards() {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [isEndOfList, setIsEndOfList] = useState(true)
  const [isError, setIsError] = useState(false)
  const [{ cards, isSearching }, dispatch] = useContext(DefaultContext)
  const [{ page, value }, { setPage }] = useSearchParams()
  const [{ productsSelected, lang }] = useSettings()
  const currentLang = useRef(lang)
  const productsVisible = useRef(productsSelected.filter(e => e.visible).length)
  const isSubscribed = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    if (!productsSelected.length) {
      dispatch({ type: REMOVE_CARDS })
      dispatch({ type: SET_SEARCHING_STATUS, isSearching: false })
      return
    }
    if (productsVisible.current !== productsSelected.filter(e => e.visible).length) {
      productsVisible.current = productsSelected.filter(e => e.visible).length
      dispatch({ type: REMOVE_CARDS })
    } else if (lang !== currentLang.current) {
      currentLang.current = lang
      dispatch({ type: REMOVE_CARDS })
    }
    if (value) {
      const loadCards = async () => {
        const productsId = productsSelected.filter(e => e.visible).map(e => e.id)
        try {
          setIsError(false)
          isSubscribed.current = true
          setIsEndOfList(false)
          dispatch({ type: SET_SEARCHING_STATUS, isSearching: true })
          await wait(500)
          if (!isSubscribed.current) return
          const response = await searchCards({ productsId, page, search: value, lang }, controller.signal)
          if (!isSubscribed.current) return
          setIsEndOfList(page >= response.pages)
          dispatch({ type: SET_CARDS, cards: response.result })
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('FetchCancel: caught abort')
          } else {
            console.warn(error)
            setIsError(true)
            enqueueSnackbar(t('error.unknown'), {
              variant: 'warning',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center'
              },
              autoHideDuration: 2000
            })
          }
        } finally {
          dispatch({ type: SET_SEARCHING_STATUS, isSearching: false })
        }
      }

      loadCards()
    }

    return () => {
      controller.abort()
      isSubscribed.current = false
    }
  }, [dispatch, lang, productsSelected, value, page, enqueueSnackbar, t])

  let content = null
  if (isSearching) {
    content = (
      <Loader>
        <CircularProgress size={20} />
      </Loader>
    )
  } else if (!productsSelected.length) {
    content = (
      <Warning>
        <Typography component="p">{t('chooseProduct')}</Typography>
      </Warning>
    )
  } else if (value.trim() !== '' && isEndOfList && cards.length === 0) {
    content = (
      <Warning>
        <Typography component="h1">{t('noResult')}</Typography>
      </Warning>
    )
  } else if (value.trim() === '' || isError) {
    content = (
      <IllusTab>
        <img src="/images/undraw_file_searching_duff.svg" alt="RSS Feed" style={{ width: 160 }} />
        <Typography component="h1" variant="h6">
          {t('searchTitle')}
        </Typography>
        <Typography component="p" variant="body2" style={{ lineHeight: 1.1, fontWeight: 'normal' }}>
          {t('searchIntro')}
        </Typography>
      </IllusTab>
    )
  }

  return (
    <div className="main-content" style={{ paddingTop: !cards.length && isSearching ? 16 : 0 }}>
      {productsSelected.length && !!cards.length && <ListCards cards={cards} enqueueSnackbar={enqueueSnackbar} />}
      {content}
      {!isSearching && !isEndOfList && value && cards.length > 0 && (
        <ViewMore>
          <Button size="small" onClick={() => setPage(page + 1)}>
            {t('viewMore')}
          </Button>
        </ViewMore>
      )}
    </div>
  )
}

export default SearchCards
