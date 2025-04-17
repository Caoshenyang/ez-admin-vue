import type { PageQuery } from '@/types/common'
import type { UserQuey } from '@/types/system'

export const defaultProps = {
  children: 'children',
  label: 'deptName',
  value: 'deptId'
}

export const INIT_USER_QUERY: PageQuery<UserQuey> = {
  pageNum: 1,
  pageSize: 10,
  orderItems: [
    {
      column: 'create_time',
      asc: true
    }
  ],
  search: {
    username: ''
  }
}
