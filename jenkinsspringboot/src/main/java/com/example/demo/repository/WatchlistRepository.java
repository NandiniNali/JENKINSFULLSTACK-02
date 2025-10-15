package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.WatchlistEntity;
import java.util.List;

@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistEntity, Integer> {
    List<WatchlistEntity> findByStatus(String status);

	List<WatchlistEntity> findAll();
}
