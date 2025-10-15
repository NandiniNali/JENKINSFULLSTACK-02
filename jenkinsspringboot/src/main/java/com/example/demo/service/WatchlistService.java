package com.example.demo.service;

import java.util.List;
import com.example.demo.entity.WatchlistEntity;

public interface WatchlistService {
    WatchlistEntity addWatchlist(WatchlistEntity w);
    List<WatchlistEntity> getAllWatchlist();
    WatchlistEntity getWatchlistById(int id);
    WatchlistEntity updateWatchlist(WatchlistEntity w);
    void deleteWatchlistById(int id);
    List<WatchlistEntity> getWatchlistByStatus(String status);
}
