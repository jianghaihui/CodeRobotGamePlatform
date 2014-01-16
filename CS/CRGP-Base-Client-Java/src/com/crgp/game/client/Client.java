package com.crgp.game.client;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

import com.crgp.game.client.message.ActionMessage;
import com.crgp.game.client.message.DataMessage;
import com.crgp.game.client.message.Message;
import com.crgp.game.client.util.ByteUtils;

public class Client {
	public static final String SEND = "SEND";
	public static final String RECEIVE = "RECEIVE";

	public static final String IP = "127.0.0.1";
	public static final int PORT = 15000;

	private Socket sendClient;
	private Socket receiveClient;

	private InputStream sendClientIS;
	private OutputStream sendClientOS;
	private InputStream receiveClientIS;
	private OutputStream receiveClientOS;

	private Map<String, Action> actionMap = new HashMap<String, Action>();

	private final String UID;

	public Client(String UID) throws Exception {
		this.UID = UID;

		System.out.println("[CLIENT]  :  " + UID + " SendClient进行握手");
		try {
			sendClient = new Socket(IP, PORT);
			sendClient.setKeepAlive(true);

			sendClientIS = sendClient.getInputStream();
			sendClientOS = sendClient.getOutputStream();
			// 握手
			sendClientOS.write(ByteUtils.intToByteArray((SEND + ":" + UID).getBytes().length));
			sendClientOS.write((SEND + ":" + UID).getBytes());
			sendClientOS.flush();
		} catch (Exception e) {
			throw new Exception("通讯服务客户端错误！");
		}
		System.out.println("[CLIENT]  :  " + UID + " SendClient握手成功");

		System.out.println("[CLIENT]  :  " + UID + " ReceiveClient进行握手");
		try {
			receiveClient = new Socket(IP, PORT);
			receiveClient.setKeepAlive(true);

			receiveClientIS = receiveClient.getInputStream();
			receiveClientOS = receiveClient.getOutputStream();
			// 握手
			receiveClientOS.write(ByteUtils.intToByteArray((RECEIVE + ":" + UID).getBytes().length));
			receiveClientOS.write((RECEIVE + ":" + UID).getBytes());
			receiveClientOS.flush();
			new Thread(new ReceiveClientProcesser()).start();
		} catch (Exception e) {
			throw new Exception("通讯服务客户端错误！");
		}
		System.out.println("[CLIENT]  :  " + UID + " ReceiveClient握手成功");
	}

	public void registAction(String name, Action action) {
		actionMap.put(name, action);
	}

	public DataMessage send(Message message) {
		DataMessage dataMessage = null;
		System.out.println("[CLIENT]  :  " + UID + " 发送请求信息 : (" + message.getMessage().getBytes().length + ") "
				+ message.getMessage());
		try {
			sendClientOS.write(ByteUtils.intToByteArray(message.getMessage().getBytes().length));
			sendClientOS.write(message.getMessage().getBytes());
			sendClientOS.flush();

			if (message.hasReceipt()) {
				System.out.println("[CLIENT]  :  " + UID + " 有返回数据，等待数据返回");

				// 读取数据大小
				byte sb[] = new byte[4];
				sendClientIS.read(sb);
				int size = ByteUtils.byteArrayToInt(sb);
				// 读取数据
				byte b[] = new byte[1024];
				int len = sendClientIS.read(b);
				String cmd = new String(b, 0, len);
				size = size - len;
				while (size > 0) {
					len = sendClientIS.read(b);
					cmd = cmd + new String(b, 0, len);
					size = size - len;
				}

				System.out.println("[CLIENT]  :  " + UID + " 收到返回数据：(" + size + ")" + cmd);

				dataMessage = (DataMessage) Message.createMessage(cmd);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("[CLIENT]  :  " + UID + " 发送请求信息完成");
		return dataMessage;
	}

	class ReceiveClientProcesser implements Runnable {
		@Override
		public void run() {
			try {
				while (true) {
					// 读取数据大小
					byte sb[] = new byte[4];
					receiveClientIS.read(sb);
					int size = ByteUtils.byteArrayToInt(sb);
					// 读取数据
					byte b[] = new byte[1024];
					int len = receiveClientIS.read(b);
					String cmd = new String(b, 0, len);
					size = size - len;
					while (size > 0) {
						len = receiveClientIS.read(b);
						cmd = cmd + new String(b, 0, len);
						size = size - len;
					}

					System.out.println("[CLIENT]  :  " + UID + " 收到请求信息：(" + size + ")" + cmd);

					ActionMessage actionMessage = (ActionMessage) Message.createMessage(cmd);
					Action action = actionMap.get(actionMessage.getActionName());
					Map<String, String> result = action.execute(actionMessage);

					if (actionMessage.hasReceipt()) {
						System.out.println("[CLIENT]  :  " + UID + " 有返回值，构建返回数据");

						DataMessage dataMessage = new DataMessage(actionMessage.getTargetType(), actionMessage
								.getTargetId(), actionMessage.getSourceType(), actionMessage.getSourceId());
						dataMessage.setDatas(result);

						System.out.println("[CLIENT]  :  " + UID + " 将返回数据回写到流中 : ("
								+ dataMessage.getMessage().getBytes().length + ")" + dataMessage.getMessage());
						receiveClientOS.write(ByteUtils.intToByteArray(dataMessage.getMessage().getBytes().length));
						receiveClientOS.write(dataMessage.getMessage().getBytes());
						receiveClientOS.flush();
					}
					System.out.println("[CLIENT]  :  " + UID + " 请求信息处理结束");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
