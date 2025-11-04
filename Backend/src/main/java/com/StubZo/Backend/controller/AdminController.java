package com.StubZo.Backend.controller;

import com.StubZo.Backend.entity.Building;
import com.StubZo.Backend.entity.Room;
import com.StubZo.Backend.entity.ServiceEntity;
import com.StubZo.Backend.entity.User;
import com.StubZo.Backend.entity.UserRole;
import com.StubZo.Backend.repository.BuildingRepository;
import com.StubZo.Backend.repository.RoomRepository;
import com.StubZo.Backend.repository.ServiceRepository;
import com.StubZo.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final BuildingRepository buildingRepository;
    private final RoomRepository roomRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ========== Building Management ==========
    @PostMapping("/buildings")
    public ResponseEntity<?> addBuilding(@RequestBody Map<String, Object> request) {
        try {
            Building building = Building.builder()
                    .name((String) request.get("name"))
                    .totalRooms(request.get("totalRooms") != null ? Integer.parseInt(request.get("totalRooms").toString()) : null)
                    .startingRoomNumber(request.get("startingRoomNumber") != null ? Integer.parseInt(request.get("startingRoomNumber").toString()) : null)
                    .customRoomNumbering(request.get("customRoomNumbering") != null ? (Boolean) request.get("customRoomNumbering") : false)
                    .build();
            building = buildingRepository.save(building);
            return ResponseEntity.ok(Map.of("success", true, "data", building));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/buildings")
    public ResponseEntity<?> getAllBuildings() {
        List<Building> buildings = buildingRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", buildings));
    }

    @GetMapping("/buildings/{id}")
    public ResponseEntity<?> getBuilding(@PathVariable Long id) {
        return buildingRepository.findById(id)
                .map(building -> ResponseEntity.ok(Map.of("success", true, "data", building)))
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Building not found")));
    }

    @PutMapping("/buildings/{id}")
    public ResponseEntity<?> updateBuilding(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return buildingRepository.findById(id)
                .map(building -> {
                    if (request.containsKey("name")) building.setName((String) request.get("name"));
                    if (request.containsKey("totalRooms")) building.setTotalRooms(Integer.parseInt(request.get("totalRooms").toString()));
                    if (request.containsKey("startingRoomNumber")) building.setStartingRoomNumber(Integer.parseInt(request.get("startingRoomNumber").toString()));
                    if (request.containsKey("customRoomNumbering")) building.setCustomRoomNumbering((Boolean) request.get("customRoomNumbering"));
                    building = buildingRepository.save(building);
                    return ResponseEntity.ok(Map.of("success", true, "data", building));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Building not found")));
    }

    @DeleteMapping("/buildings/{id}")
    public ResponseEntity<?> deleteBuilding(@PathVariable Long id) {
        if (buildingRepository.existsById(id)) {
            buildingRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Building not found"));
    }

    // ========== Room Management ==========
    @PostMapping("/rooms")
    public ResponseEntity<?> addRoom(@RequestBody Map<String, Object> request) {
        try {
            Long buildingId = Long.parseLong(request.get("buildingId").toString());
            Building building = buildingRepository.findById(buildingId)
                    .orElseThrow(() -> new RuntimeException("Building not found"));

            Room room = Room.builder()
                    .roomNumber((String) request.get("roomNumber"))
                    .building(building)
                    .sharingType((String) request.get("sharingType"))
                    .capacity(request.get("capacity") != null ? Integer.parseInt(request.get("capacity").toString()) : null)
                    .rent(request.get("rent") != null ? Double.parseDouble(request.get("rent").toString()) : null)
                    .status(request.get("status") != null ? (String) request.get("status") : "AVAILABLE")
                    .build();
            room = roomRepository.save(room);
            return ResponseEntity.ok(Map.of("success", true, "data", room));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", rooms));
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<?> getRoom(@PathVariable Long id) {
        return roomRepository.findById(id)
                .map(room -> ResponseEntity.ok(Map.of("success", true, "data", room)))
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Room not found")));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return roomRepository.findById(id)
                .map(room -> {
                    if (request.containsKey("roomNumber")) room.setRoomNumber((String) request.get("roomNumber"));
                    if (request.containsKey("sharingType")) room.setSharingType((String) request.get("sharingType"));
                    if (request.containsKey("capacity")) room.setCapacity(Integer.parseInt(request.get("capacity").toString()));
                    if (request.containsKey("rent")) room.setRent(Double.parseDouble(request.get("rent").toString()));
                    if (request.containsKey("status")) room.setStatus((String) request.get("status"));
                    if (request.containsKey("buildingId")) {
                        Long buildingId = Long.parseLong(request.get("buildingId").toString());
                        buildingRepository.findById(buildingId).ifPresent(room::setBuilding);
                    }
                    room = roomRepository.save(room);
                    return ResponseEntity.ok(Map.of("success", true, "data", room));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Room not found")));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Room not found"));
    }

    // ========== Service Management ==========
    @PostMapping("/services")
    public ResponseEntity<?> addService(@RequestBody Map<String, Object> request) {
        try {
            ServiceEntity service = ServiceEntity.builder()
                    .name((String) request.get("name"))
                    .description((String) request.get("description"))
                    .build();
            service = serviceRepository.save(service);
            return ResponseEntity.ok(Map.of("success", true, "data", service));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        List<ServiceEntity> services = serviceRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", services));
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<?> getService(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(service -> ResponseEntity.ok(Map.of("success", true, "data", service)))
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Service not found")));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return serviceRepository.findById(id)
                .map(service -> {
                    if (request.containsKey("name")) service.setName((String) request.get("name"));
                    if (request.containsKey("description")) service.setDescription((String) request.get("description"));
                    service = serviceRepository.save(service);
                    return ResponseEntity.ok(Map.of("success", true, "data", service));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "Service not found")));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Service not found"));
    }

    // ========== User Management ==========
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(Map.of("success", true, "data", user)))
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found")));
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email already registered"));
            }

            User user = User.builder()
                    .name((String) request.get("name"))
                    .email(email)
                    .password(passwordEncoder.encode((String) request.get("password")))
                    .role(UserRole.valueOf(((String) request.get("role")).toUpperCase()))
                    .active(true)
                    .build();
            user = userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "data", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return userRepository.findById(id)
                .map(user -> {
                    if (request.containsKey("name")) user.setName((String) request.get("name"));
                    if (request.containsKey("password")) user.setPassword(passwordEncoder.encode((String) request.get("password")));
                    if (request.containsKey("role")) user.setRole(UserRole.valueOf(((String) request.get("role")).toUpperCase()));
                    if (request.containsKey("active")) user.setActive((Boolean) request.get("active"));
                    user = userRepository.save(user);
                    return ResponseEntity.ok(Map.of("success", true, "data", user));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found")));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
    }

    // Legacy endpoint for backward compatibility
    @PostMapping("/addBuilding")
    public ResponseEntity<?> addBuildingLegacy(@RequestBody Map<String, Object> request) {
        return addBuilding(request);
    }
}
