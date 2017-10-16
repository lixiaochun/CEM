package io.cem.modules.cem.service;

import io.cem.modules.cem.entity.TargetEntity;

import java.util.List;
import java.util.Map;

/**
 * 
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2017-10-12 17:12:45
 */
public interface TargetService {
	
	TargetEntity queryObject(Integer id);
	
	List<TargetEntity> queryList(Map<String, Object> map);
	
	int queryTotal(Map<String, Object> map);
	
	void save(TargetEntity target);
	
	void update(TargetEntity target);
	
	void delete(Integer id);
	
	void deleteBatch(Integer[] ids);
}