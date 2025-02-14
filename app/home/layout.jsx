import { Flex } from 'antd'
import PropTypes from 'prop-types'

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default function HomeLayout({ children }) {
  return (
    <Flex className="items-center justify-center h-full w-full">
      <Flex className="items-center justify-center" vertical>
        {children}
      </Flex>
    </Flex>
  )
}
