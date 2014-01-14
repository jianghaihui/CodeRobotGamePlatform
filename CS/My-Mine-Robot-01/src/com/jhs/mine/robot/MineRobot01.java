package com.jhs.mine.robot;

import java.awt.Point;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.xjiang.mine.robot.MineRobot;

public class MineRobot01 extends MineRobot {

	@Override
	public String RobotUID() {
		return "jhs_mine_robot_01";
	}

	@Override
	public synchronized Map<String, String> play() {
		int[][] map = getMap();

		Set<Point> mines = new HashSet<Point>();

		Point p = loopSearch(mines);
		if (p == null) {
			System.out.println("random begin");
			ArrayList<Point> ps = new ArrayList<Point>();
			for (int i = 0; i < map.length; i++) {
				for (int j = 0; j < map[i].length; j++) {
					if (map[i][j] == -1 && !mines.contains(new Point(j, i))) {
						ps.add(new Point(j, i));
					}
				}
			}

			int ram = (int) (Math.random() * ps.size());

			p = ps.get(ram);
			System.out.println("random end " + p.x + " -- " + p.y);
		}

		Map<String, String> resultMap = new HashMap<String, String>();
		resultMap.put("x", p.x + "");
		resultMap.put("y", p.y + "");

		return resultMap;
	}

	private Point loopSearch(Set<Point> mines) {
		int[][] map = getMap();

		// 可能有雷的位置
		ArrayList<Point> maybeHasMines = new ArrayList<Point>();

		// 计算有雷的位置
		for (int i = 0; i < map.length; i++) {
			for (int j = 0; j < map[i].length; j++) {
				int info = map[i][j];
				if (info > 0) {
					ArrayList<Point> _mines = findUnClick(map, j, i);

					if (_mines.size() == info) {
						mines.addAll(_mines);
					} else {
						maybeHasMines.addAll(_mines);
					}
				}
			}
		}
		// 计算无雷的位置,算法1
		for (int i = 0; i < map.length; i++) {
			for (int j = 0; j < map[i].length; j++) {
				int info = map[i][j];
				if (info > 0) {
					ArrayList<Point> _mines = findUnClick(map, j, i);

					int mineCount = 0;
					for (int k = 0; k < _mines.size(); k++) {
						Point p = _mines.get(k);
						if (mines.contains(p)) {
							_mines.remove(k);
							k--;
							mineCount++;
						}
					}

					if (mineCount == info && _mines.size() > 0) {
						return _mines.get(0);
					}
				}
			}
		}

		return null;
	}

	private ArrayList<Point> findUnClick(int[][] map, int x, int y) {
		ArrayList<Point> _mines = new ArrayList<Point>();

		if (y + 1 < map.length && map[y + 1][x] == -1) {
			_mines.add(new Point(x, y + 1));
		}
		if (y + 1 < map.length && x + 1 < map[y].length
				&& map[y + 1][x + 1] == -1) {
			_mines.add(new Point(x + 1, y + 1));
		}
		if (y + 1 < map.length && x - 1 >= 0 && map[y + 1][x - 1] == -1) {
			_mines.add(new Point(x - 1, y + 1));
		}
		if (y - 1 >= 0 && map[y - 1][x] == -1) {
			_mines.add(new Point(x, y - 1));
		}
		if (y - 1 >= 0 && x + 1 < map[y].length && map[y - 1][x + 1] == -1) {
			_mines.add(new Point(x + 1, y - 1));
		}
		if (y - 1 >= 0 && x - 1 >= 0 && map[y - 1][x - 1] == -1) {
			_mines.add(new Point(x - 1, y - 1));
		}
		if (x - 1 >= 0 && map[y][x - 1] == -1) {
			_mines.add(new Point(x - 1, y));
		}
		if (x + 1 < map[y].length && map[y][x + 1] == -1) {
			_mines.add(new Point(x + 1, y));
		}
		return _mines;
	}
}
