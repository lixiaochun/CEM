package io.cem.modules.cem.service;

import io.cem.modules.cem.entity.RecordWebDownloadEntity;

import java.util.List;
import java.util.Map;

/**
 * 
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-10-12 17:12:47
 */
public interface RecordWebDownloadService {
	
	RecordWebDownloadEntity queryObject(Integer id);
	
	List<RecordWebDownloadEntity> queryList(Map<String, Object> map);
	
	int queryTotal(Map<String, Object> map);
	
	void save(RecordWebDownloadEntity recordWebDownload);
	
	void update(RecordWebDownloadEntity recordWebDownload);
	
	void delete(Integer id);
	
	void deleteBatch(Integer[] ids);
}