package com.crgp.robot.action;

import java.util.HashMap;
import java.util.Map;

import com.crgp.game.client.Action;
import com.crgp.game.client.message.ActionMessage;
import com.crgp.robot.BaseRobot;

public class UIDAction extends Action {

	private BaseRobot robot;

	public UIDAction(BaseRobot robot) {
		this.robot = robot;
	}

	@Override
	public Map<String, String> execute(ActionMessage message) throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		map.put("UID", robot.UID());
		return map;
	}

}
