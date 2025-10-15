package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entity.WatchlistEntity;
import com.example.demo.repository.WatchlistRepository;

@Service
public class WatchlistServiceImpl implements WatchlistService {

    @Autowired
    private WatchlistRepository repo;

    public WatchlistEntity addWatchlist(WatchlistEntity w) {
        return repo.save(w);
    }

    public List<WatchlistEntity> getAllWatchlist() {
        return repo.findAll();
    }

    public WatchlistEntity getWatchlistById(int id) {
        return repo.findById(id).orElse(null);
    }

    public WatchlistEntity updateWatchlist(WatchlistEntity w) {
        return repo.save(w);
    }

    public void deleteWatchlistById(int id) {
        repo.deleteById(id);
    }

    public List<WatchlistEntity> getWatchlistByStatus(String status) {
        return repo.findByStatus(status);
    }
}
