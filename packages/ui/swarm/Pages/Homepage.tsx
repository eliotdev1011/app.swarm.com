import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const Homepage = () => {
  const history = useHistory()

  useEffect(() => {
    history.push('/v1/dotc')
  }, [history])

  return null
}

export default Homepage
