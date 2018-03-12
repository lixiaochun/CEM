package io.cem.modules.cem.service;

import io.cem.modules.cem.entity.RecordDayFtpEntity;

import java.util.List;
import java.util.Map;

/**
 * 
 * 
 * @author ${author}
 * @email ${email}
 * @date 2018-01-30 12:10:03
 */
public interface RecordDayFtpService {
	
	RecordDayFtpEntity queryObject(Integer id);
	
	List<RecordDayFtpEntity> queryList(Map<String, Object> map);

	List<RecordDayFtpEntity> queryDay(Map<String,Object> map);
	
	int queryTotal(Map<String, Object> map);
	
	void save(RecordDayFtpEntity recordDayFtp);
	
	void update(RecordDayFtpEntity recordDayFtp);
	
	void delete(Integer id);
	
	void deleteBatch(Integer[] ids);
}