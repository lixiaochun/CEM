package io.cem.modules.cem.service;

import io.cem.modules.cem.entity.RecordHourTracertEntity;
import io.cem.modules.cem.entity.RecordTracertEntity;

import java.util.List;
import java.util.Map;

/**
 */
public interface RecordTracertService {
	
	RecordTracertEntity queryObject(Integer id);

	List<RecordTracertEntity> queryList(Map<String, Object> map);

	List<RecordTracertEntity> queryTracertTest(Map<String, Object> map);

	List<RecordTracertEntity> queryTracertList(Map<String, Object> map);

	List<RecordHourTracertEntity> queryIntervalList(Map<String, Object> map);

	int queryIntervalTotal(Map<String, Object> map);
	
	int queryTotal(Map<String, Object> map);
	
	void save(RecordTracertEntity recordTracert);
	
	void update(RecordTracertEntity recordTracert);
	
	void delete(Integer id);
	
	void deleteBatch(Integer[] ids);
}
