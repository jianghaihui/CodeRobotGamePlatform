package com.crgp.game.client.message;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class ActionMessage extends Message {
	public static final String TYPE = "ACTION";

	private String actionName;
	private Map<String, String> params = new HashMap<String, String>();

	public ActionMessage(String message) {
		String tmp[] = message.split(";");
		sourceType = tmp[0].split(":")[0];
		sourceId = tmp[0].split(":")[1];
		targetType = tmp[1].split(":")[0];
		targetId = tmp[1].split(":")[1];

		String action = tmp[2].split(":")[1];
		actionName = action.split("?")[0];
		if (action.split("?").length > 1) {
			String ps[] = action.split("?")[1].split("&");
			for (int i = 0; i < ps.length; i++) {
				addParam(ps[i].split("=")[0], ps[i].split("=")[1]);
			}
		}
	}

	public ActionMessage(String sourceType, String sourceId, String targetType,
			String targetId) {
		this.sourceType = sourceType;
		this.sourceId = sourceId;
		this.targetType = targetType;
		this.targetId = targetId;
	}

	public String getActionName() {
		return actionName;
	}

	public void setActionName(String actionName) {
		this.actionName = actionName;
	}

	public void addParam(String key, String value) {
		params.put(key, value);
	}

	public Map<String, String> getParams() {
		return params;
	}

	public String getParam(String key) {
		return params.get(key);
	}

	@Override
	public String getType() {
		return TYPE;
	}

	@Override
	public String getMessage() {
		String action = actionName;
		Set<String> keySet = params.keySet();
		if (keySet.size() > 0) {
			action = action + "?";
		}
		Iterator<String> it = keySet.iterator();
		while (it.hasNext()) {
			String key = it.next();
			String value = params.get(key);
			action = action + key + "=" + value;
			if (it.hasNext()) {
				action = action + "&";
			}
		}

		return sourceType + ":" + sourceId + ";" + targetType + ":" + targetId
				+ ";" + getType() + ":" + action;
	}
}
