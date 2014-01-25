package com.crgp.fivechess.game.action;

import java.util.HashMap;
import java.util.Map;

import com.crgp.fivechess.game.FiveChessGame;
import com.crgp.game.client.Action;
import com.crgp.game.client.message.ActionMessage;

public class CurrTypeAction extends Action {
	private FiveChessGame game;

	public CurrTypeAction(FiveChessGame game) {
		this.game = game;
	}

	@Override
	public Map<String, String> execute(ActionMessage message) throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		map.put("currType", game.getCurrType() + "");
		return map;
	}

}