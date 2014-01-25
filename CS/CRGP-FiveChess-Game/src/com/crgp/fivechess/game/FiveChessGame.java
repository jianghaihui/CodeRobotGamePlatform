package com.crgp.fivechess.game;

import java.awt.Point;
import java.util.Map;

import javax.swing.JPanel;

import com.crgp.fivechess.game.action.CurrTypeAction;
import com.crgp.fivechess.game.action.LastClickAction;
import com.crgp.fivechess.game.action.MapAction;
import com.crgp.fivechess.game.ui.FiveChessView;
import com.crgp.game.BaseGame;

public class FiveChessGame extends BaseGame {
	private FiveChessView view;

	public FiveChessGame() {
		client.registAction("getMap", new MapAction(this));
		client.registAction("getLastClick", new LastClickAction(this));
		client.registAction("getCurrType", new CurrTypeAction(this));
	}

	@Override
	public String GameUID() {
		return "CRGP-FiveChess-Game";
	}

	@Override
	public String getName() {
		return "五子棋";
	}

	@Override
	public JPanel createView() {
		view = new FiveChessView(this);
		return view;
	}

	@Override
	public void playerBegin() {
		view.addEvent();
	};

	@Override
	public void playerEnd() {
		view.removeEvent();
	}

	@Override
	public void playEnd(Map<String, String> playResult) {
		// 验证执行结果
		String xTmp = playResult.get("x");
		String yTmp = playResult.get("y");
		if (xTmp != null && yTmp != null) {
			int x;
			int y;
			try {
				x = Integer.parseInt(xTmp);
				y = Integer.parseInt(yTmp);

				view.click(x, y);
				view.repaint();
			} catch (NumberFormatException e) {
				e.printStackTrace();
				System.err.println("MineGame.playEnd : " + "执行结果解析错误: " + xTmp + " " + yTmp);
			}
		}
	}

	@Override
	public boolean isEnd() {
		return view.isWin();
	}

	@Override
	public void launch(Map<String, String> params) {
		view.init();
	}

	@Override
	public int playerCount() {
		return 2;
	}

	// -------------------------
	// ---
	// ---信号与槽(Signal and Slots)
	// ---
	// -------------------------

	/**
	 * [SLOT]获取地图
	 * 
	 * @return
	 */
	public int[][] getMap() {
		return view.getMap();
	}

	/**
	 * [SLOT]获取最后点击的位置
	 * 
	 * @return
	 */
	public Point getLastClick() {
		return view.getLastClick();
	}

	/**
	 * [SLOT]获取当前由哪一方落子
	 * 
	 * @return
	 */
	public int getCurrType() {
		return view.getCurrType();
	}
}
