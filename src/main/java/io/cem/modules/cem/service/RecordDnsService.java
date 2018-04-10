package io.cem.modules.cem.service;

import io.cem.modules.cem.entity.RecordDnsEntity;
import io.cem.modules.cem.entity.RecordHourDnsEntity;

import java.util.List;
import java.util.Map;

/**
 *
 */
public interface RecordDnsService {
	
	RecordDnsEntity queryObject(Integer id);
	
	List<RecordDnsEntity> queryList(Map<String, Object> map);

	List<RecordDnsEntity> queryDnsTest(Map<String, Object> map);

	List<RecordDnsEntity> queryDnsList(Map<String, Object> map);

	List<RecordHourDnsEntity> queryIntervalList(Map<String, Object> map);

	int queryIntervalTotal(Map<String, Object> map);

	int queryTotal(Map<String, Object> map);
	
	void save(RecordDnsEntity recordDns);
	
	void update(RecordDnsEntity recordDns);
	
	void delete(Integer id);
	
	void deleteBatch(Integer[] ids);
}
