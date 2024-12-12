import { useEffect, useRef } from 'react'

import edgeTag from '@core/services/edgeTag'
import { useEdgetagLocalStorage } from '@core/shared/localStorage/edgetagLocalStorage'

const useInitEdgetag = () => {
  const { value: edgetagEnabled } = useEdgetagLocalStorage()
  const initiatedEdgetagInitializeRef = useRef(false)
  const initiatedEdgeTagRef = useRef(false)

  useEffect(() => {
    if (edgetagEnabled && !initiatedEdgetagInitializeRef.current) {
      edgeTag.initialize()
      initiatedEdgetagInitializeRef.current = true
    }
  }, [edgetagEnabled])

  useEffect(() => {
    if (edgetagEnabled && !initiatedEdgeTagRef.current) {
      edgeTag.tagPageView()
      initiatedEdgeTagRef.current = true
    }
  }, [edgetagEnabled])
}

export default useInitEdgetag
