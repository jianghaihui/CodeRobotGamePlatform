package com.crgp.game.client.message;

public abstract class Message {
	public static final String TYPE_GAME = "TYPE_GAME";
	public static final String TYPE_ROBOT = "TYPE_ROBOT";

	protected String sourceType;
	protected String sourceId;
	protected String targetType;
	protected String targetId;
	protected String type;
	protected boolean hasReceipt = false;

	public String getSourceType() {
		return sourceType;
	}

	public String getSourceId() {
		return sourceId;
	}

	public String getTargetType() {
		return targetType;
	}

	public String getTargetId() {
		return targetId;
	}

	public String getType() {
		return type;
	}

	public void setHasReceipt(boolean hasReceipt) {
		this.hasReceipt = hasReceipt;
	}

	public boolean hasReceipt() {
		return hasReceipt;
	}

	public abstract String getMessage();

	public static Message createMessage(String message) {

		String tmp[] = message.split(";");
		String sourceType = tmp[0].split(":")[0];
		String sourceId = tmp[0].split(":")[1];
		String targetType = tmp[1].split(":")[0];
		String targetId = tmp[1].split(":")[1];

		String type = tmp[2].split(":")[0];
		if (type.equals(ActionMessage.TYPE)) {
			ActionMessage actionMessage = new ActionMessage(sourceType,
					sourceId, targetType, targetId);

			String action = tmp[2].split(":")[1];
			String actionName = action.split("\\?")[0];
			if (action.split("\\?").length > 1) {
				String ps[] = action.split("\\?")[1].split("&");
				for (int i = 0; i < ps.length; i++) {
					actionMessage.addParam(ps[i].split("=")[0], ps[i]
							.split("=")[1]);
				}
			}
			actionMessage.setActionName(actionName);

			actionMessage.setHasReceipt(tmp[3].equals("1"));

			return actionMessage;
		} else if (type.equals(DataMessage.TYPE)) {
			DataMessage dataMessage = new DataMessage(sourceType, sourceId,
					targetType, targetId);
			String data = tmp[2].split(":")[1];
			if (data.split("&").length > 0) {
				String map[] = data.split("&");
				for (int i = 0; i < map.length; i++) {
					dataMessage.addData(map[i].split("=")[0],
							map[i].split("=")[1]);
				}
			}
			return dataMessage;
		}
		return null;
	}
}
