import type { PageQuery, PageVO } from '@/types/common'
import type { DictDataForm, DictTypeForm, DictTypeListVO, DictTypeQuery } from '@/types/system'
import http from '@/utils/request'

export const dictApi = {
  // 获取字典类型列表（分页）
  selectDictTypePage: (data?: PageQuery<DictTypeQuery>) =>
    http.post<PageVO<DictTypeListVO>>('/system/dict/type/page', data),
  // 创建字典类型
  createDictType: (data: DictTypeForm) => http.post('/system/dict/type/create', data),
  // 更新字典类型
  updateDictType: (data: DictTypeForm) => http.post('/system/dict/type/update', data),
  // 删除字典类型
  deleteDictType: (dictId: string) => http.delete(`/system/dict/type/delete/${dictId}`),
  // 获取字典类型详情
  getDictTypeDetail: (dictId: string) => http.get<DictTypeForm>(`/system/dict/type/${dictId}`),
  // 获取字典数据列表（无分页）
  selectDictDataList: (dictId: string) => http.get<DictTypeListVO[]>(`/system/dict/data/list/${dictId}`),
  // 创建字典数据
  createDictData: (data: DictDataForm) => http.post('/system/dict/data/create', data),
  // 更新字典数据
  updateDictData: (data: DictDataForm) => http.post('/system/dict/data/update', data),
  // 删除字典数据
  deleteDictData: (dictDataId: string) => http.delete(`/system/dict/data/delete/${dictDataId}`),
  // 获取字典数据详情
  getDictDataDetail: (dictDataId: string) => http.get<DictDataForm>(`/system/dict/data/${dictDataId}`)
}
