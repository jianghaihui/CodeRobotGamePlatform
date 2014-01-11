package com.crgp.platform.xml.bean;

import java.util.HashMap;
import java.util.Map;

public class GameBean {
	private String launchClass;
	private Map<String, String> params = new HashMap<String, String>();

	public void setLaunchClass(String launchClass) {
		this.launchClass = launchClass;
	}

	public String getLaunchClass() {
		return launchClass;
	}

	public void putParam(String key, String value) {
		params.put(key, value);
	}

	public Map<String, String> getParams() {
		return params;
	}
}
