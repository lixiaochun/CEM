package io.cem.modules.cem.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import io.cem.common.exception.RRException;
import io.cem.common.utils.JSONUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.cem.modules.cem.entity.ProbeEntity;
import io.cem.modules.cem.service.ProbeService;
import io.cem.common.utils.PageUtils;
import io.cem.common.utils.Query;
import io.cem.common.utils.R;


/**
 * @author Miao
 * @date 2017-10-12 17:12:46
 */
@RestController
@RequestMapping("/cem/probe")
public class ProbeController {
	@Autowired
	private ProbeService probeService;
	
	/**
	 * 列表
	 */
	@RequestMapping("/list")
	@RequiresPermissions("probe:list")
	public R list(String probedata, Integer page, Integer limit) throws Exception {
		Map<String, Object> map = new HashMap<>();
		map.put("offset", (page - 1) * limit);
		map.put("limit", limit);
		JSONObject probedata_jsonobject = JSONObject.parseObject(probedata);
		try {
			map.putAll(JSONUtils.jsonToMap(probedata_jsonobject));
		} catch (RuntimeException e) {
			throw new RRException("内部参数错误，请重试！");
		}
		List<ProbeEntity> probeList = probeService.queryList(map);
		int total = probeService.queryTotal(map);
		PageUtils pageUtil = new PageUtils(probeList, total, limit, page);
		return R.ok().put("page", pageUtil);
	}
	
	
	/**
	 * 信息
	 */
	@RequestMapping("/info/{id}")
	@RequiresPermissions("probe:info")
	public R info(@PathVariable("id") Integer id){
		ProbeEntity probe = probeService.queryObject(id);
		
		return R.ok().put("probe", probe);
	}
	
	/**
	 * 保存
	 */
	@RequestMapping("/save")
	@RequiresPermissions("probe:save")
	public R save(@RequestBody ProbeEntity probe){
		probeService.save(probe);
		
		return R.ok();
	}
	
	/**
	 * 修改
	 */
	@RequestMapping("/update")
	@RequiresPermissions("probe:update")
	public R update(@RequestBody ProbeEntity probe){
		probeService.update(probe);
		
		return R.ok();
	}
	
	/**
	 * 删除
	 */
	@RequestMapping("/delete")
	@RequiresPermissions("probe:delete")
	public R delete(@RequestBody Integer[] ids){
		probeService.deleteBatch(ids);
		
		return R.ok();
	}
	
}
