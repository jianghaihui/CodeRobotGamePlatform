package com.xjiang.mine.game.action;

import java.util.Map;

import com.crgp.game.client.Action;
import com.crgp.game.client.message.ActionMessage;
import com.xjiang.mine.game.MineGame;

public class ClickAction extends Action {
	private MineGame game;

	public ClickAction(MineGame game) {
		this.game = game;
	}

	@Override
	public Map<String, String> execute(ActionMessage message) throws Exception {
		try {
			int x;
			int y;
			x = Integer.parseInt(message.getParam("x"));
			y = Integer.parseInt(message.getParam("y"));
			game.click(x, y);
		} catch (NumberFormatException e) {
			throw new Exception("参数错误");
		}
		return null;
	}
}
