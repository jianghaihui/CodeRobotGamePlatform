package com.crgp.game.client;

import java.util.Map;

import com.crgp.game.client.message.ActionMessage;

public abstract class Action {
	public abstract Map<String, String> execute(ActionMessage message)
			throws Exception;
}
