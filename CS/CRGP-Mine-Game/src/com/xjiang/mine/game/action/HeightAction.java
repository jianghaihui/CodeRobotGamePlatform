package com.xjiang.mine.game.action;

import java.util.HashMap;
import java.util.Map;

import com.crgp.game.client.Action;
import com.crgp.game.client.message.ActionMessage;
import com.xjiang.mine.game.MineGame;

public class HeightAction extends Action {
	private MineGame game;

	public HeightAction(MineGame game) {
		this.game = game;
	}

	@Override
	public Map<String, String> execute(ActionMessage message) throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		map.put("height", game.getHeight() + "");
		return map;
	}
}
