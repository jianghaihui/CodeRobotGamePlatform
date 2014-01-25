package com.crgp.fivechess.game.action;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import com.crgp.fivechess.game.FiveChessGame;
import com.crgp.game.client.Action;
import com.crgp.game.client.message.ActionMessage;

public class MapAction extends Action {
	private FiveChessGame game;

	public MapAction(FiveChessGame game) {
		this.game = game;
	}

	@Override
	public Map<String, String> execute(ActionMessage message) throws Exception {
		Map<String, String> map = new HashMap<String, String>();

		int[][] arrays = game.getMap();
		String tmp = "";
		for (int i = 0; i < arrays.length; i++) {
			if (i > 0) {
				tmp = tmp + "|";
			}
			tmp = tmp + Arrays.toString(arrays[i]);
		}
		tmp = "[" + tmp + "]";

		map.put("map", tmp);
		return map;
	}

}