package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.WatchlistEntity;
import com.example.demo.service.WatchlistService;

@RestController
@RequestMapping("/watchlistapi")
@CrossOrigin(origins = "*")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @GetMapping("/")
    public String home() {
        return "Watchlist API is running!";
    }

    // Add a new watchlist entry
    @PostMapping("/add")
    public ResponseEntity<WatchlistEntity> addWatchlist(@RequestBody WatchlistEntity watchlist) {
        WatchlistEntity saved = watchlistService.addWatchlist(watchlist);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Get all watchlist entries
    @GetMapping("/all")
    public ResponseEntity<List<WatchlistEntity>> getAllWatchlist() {
        List<WatchlistEntity> list = watchlistService.getAllWatchlist();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // Get watchlist entries by status (Watched / Not Watched)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<WatchlistEntity>> getWatchlistByStatus(@PathVariable String status) {
        List<WatchlistEntity> list = watchlistService.getWatchlistByStatus(status);
        if (list.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    // Update an existing watchlist entry
    @PutMapping("/update")
    public ResponseEntity<?> updateWatchlist(@RequestBody WatchlistEntity watchlist) {
        WatchlistEntity existing = watchlistService.getWatchlistById(watchlist.getId());
        if (existing != null) {
            WatchlistEntity updated = watchlistService.updateWatchlist(watchlist);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot update. Watchlist entry with ID " + watchlist.getId() + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    // Delete a watchlist entry by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteWatchlist(@PathVariable int id) {
        WatchlistEntity existing = watchlistService.getWatchlistById(id);
        if (existing != null) {
            watchlistService.deleteWatchlistById(id);
            return new ResponseEntity<>("Watchlist entry with ID " + id + " deleted successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot delete. Watchlist entry with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }
}
