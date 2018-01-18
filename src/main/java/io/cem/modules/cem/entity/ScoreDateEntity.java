package io.cem.modules.cem.entity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ScoreDateEntity {
    //地市
    private String cityName;
    //区县
    private String countyName;
    //探针ID
    private String probeName;
    //测试目标ID
    private String targetName;
    //地市id
    private Integer cityId;
    //区县
    private Integer countyId;
    //探针ID
    private Integer probeId;
    //测试目标ID
    private Integer targetId;
    //记录日期
    private Date recordDate;
    //记录时间
    private String recordTime;

    private Integer accessLayer;

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getCountyName() {
        return countyName;
    }

    public void setCountyName(String countyName) {
        this.countyName = countyName;
    }

    public String getProbeName() {
        return probeName;
    }

    public void setProbeName(String probeName) {
        this.probeName = probeName;
    }

    public String getTargetName() {
        return targetName;
    }

    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public Integer getCountyId() {
        return countyId;
    }

    public void setCountyId(Integer countyId) {
        this.countyId = countyId;
    }

    public Integer getProbeId() {
        return probeId;
    }

    public void setProbeId(Integer probeId) {
        this.probeId = probeId;
    }

    public Integer getTargetId() {
        return targetId;
    }

    public void setTargetId(Integer targetId) {
        this.targetId = targetId;
    }

    public Date getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(Date recordDate) {
        this.recordDate = recordDate;
    }

    public String getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(String recordTime) {
        this.recordTime = recordTime;
    }

    @Override
    public boolean equals(Object obj) {
        ScoreDateEntity temp = (ScoreDateEntity)obj;
        String end_time = format(this.getRecordDate(), "yyyy-MM-dd", Locale.CHINA);
        String end_time1= format(temp.getRecordDate(), "yyyy-MM-dd", Locale.CHINA);
        if(this.getCityId().equals(temp.getCityId())&&this.getCountyId().equals(temp.getCountyId())&&this.getProbeId().equals(temp.getProbeId())&&this.getTargetId().equals(temp.getTargetId())&&end_time.equals(end_time1)&&this.getRecordTime().equals(temp.getRecordTime())){
            return true;
        }
        return false;
    }

    //格式化指定类型的date​，返回String
    public static String format(Date date, String pattern, Locale locale) {
        if (date == null || pattern == null) {
            return null;
        }
        return new SimpleDateFormat(pattern, locale).format(date);
    }



    @Override
    public int hashCode() {

        if(this.getCityId()!=null&&this.getCountyId()!=null&&this.getProbeId()!=null&&this.getTargetId()!=null)
            return this.getCityId()&this.getCountyId()&this.getProbeId()&this.getTargetId();
        return super.hashCode();
    }

    public Integer getAccessLayer() {
        return accessLayer;
    }

    public void setAccessLayer(Integer accessLayer) {
        this.accessLayer = accessLayer;
    }
}