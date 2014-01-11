package com.crgp.game.client.message;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class DataMessage extends Message {

	public static final String TYPE = "DATA";

	private Map<String, String> map = new HashMap<String, String>();

	public DataMessage(String message) {

	}

	public DataMessage(String sourceType, String sourceId, String targetType,
			String targetId) {
		this.sourceType = sourceType;
		this.sourceId = sourceId;
		this.targetType = targetType;
		this.targetId = targetId;
	}

	@Override
	public boolean hasReceipt() {
		return false;
	}

	public void setDatas(Map<String, String> map) {
		this.map = map;
	}

	public void addData(String key, String value) {
		map.put(key, value);
	}

	public Map<String, String> getDatas() {
		return map;
	}

	public String getData(String key) {
		return map.get(key);
	}

	@Override
	public String getType() {
		return TYPE;
	}

	@Override
	public String getMessage() {
		String data = "";
		Set<String> keySet = map.keySet();
		Iterator<String> it = keySet.iterator();
		while (it.hasNext()) {
			String key = it.next();
			String value = map.get(key);
			data = data + key + "=" + value;
			if (it.hasNext()) {
				data = data + "&";
			}
		}

		return sourceType + ":" + sourceId + ";" + targetType + ":" + targetId
				+ ";" + getType() + ":" + data;
	}
}
