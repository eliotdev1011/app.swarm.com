import { Loader, Text } from 'rimble-ui'

interface TableInfoRowProps {
  children?: React.ReactNode
  span?: number
  show?: boolean
  loading?: boolean
  error?: React.ReactNode
}

const TableInfoRow = ({
  children,
  span = 4,
  show = false,
  loading = false,
  error = false,
}: TableInfoRowProps) => {
  if (loading || show || error) {
    return (
      <tr>
        <td colSpan={span}>
          <Text.span fontWeight={2} color="grey" textAlign="center">
            {loading && <Loader size="30px" m="auto" />}
            {!loading && (error || children)}
          </Text.span>
        </td>
      </tr>
    )
  }

  return null
}

export default TableInfoRow
