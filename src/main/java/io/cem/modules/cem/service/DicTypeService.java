package io.cem.modules.cem.service;

import io.cem.modules.cem.entity.DicTypeEntity;

import java.util.List;
import java.util.Map;

/**
 */
public interface DicTypeService {
	
	DicTypeEntity queryObject(Integer id);
	
	List<DicTypeEntity> queryList(Map<String, Object> map);
	
	int queryTotal(Map<String, Object> map);
	
	void save(DicTypeEntity dicType);
	
	void update(DicTypeEntity dicType);
	
	void delete(Integer id);
	
	void deleteBatch(Integer[] ids);
}
