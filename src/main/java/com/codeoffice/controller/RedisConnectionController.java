package com.codeoffice.controller;

import com.codeoffice.common.Constant;
import com.codeoffice.common.RestCode;
import com.codeoffice.common.RestResponse;
import com.codeoffice.entity.RedisConnection;
import com.codeoffice.model.RedisConnectionVo;
import com.codeoffice.request.RedisConnectionAddRequest;
import com.codeoffice.request.RedisConnectionDeleteRequest;
import com.codeoffice.request.RedisConnectionQueryRequest;
import com.codeoffice.request.RedisConnectionUpdateRequest;
import com.codeoffice.service.RedisConnectionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

/**
 * @author: DongYanJun
 * @date: 2021/1/11 16:05
 */
@Api(value = "RedisConnection管理", tags = "RedisConnection管理")
@Slf4j
@RestController
@RequestMapping("/redisConnection")
public class RedisConnectionController {

    private final static String SERVICE_NAME = "RedisConnectionService:";

    private RedissonClient redissonClient;

    private RedisConnectionService redisConnectionService;

    public RedisConnectionController(RedissonClient redissonClient, RedisConnectionService redisConnectionService) {
        this.redissonClient = redissonClient;
        this.redisConnectionService = redisConnectionService;
    }

    @ApiOperation("获取所有Redis连接列表")
    @GetMapping(value = "/listAll")
    public RestResponse<RedisConnectionVo> getUserList() {
        return redisConnectionService.getAllList();
    }

    @ApiOperation("获取Redis连接列表")
    @GetMapping(value = "/list")
    public RestResponse<RedisConnectionVo> getUserList(@ModelAttribute RedisConnectionQueryRequest request) {
        return redisConnectionService.getList(request);
    }

    @ApiOperation("根据ID查询Redis连接")
    @GetMapping(value = "/{id}")
    public RestResponse<RedisConnection> getUser(@PathVariable("id") Long id) {
        return redisConnectionService.getById(id);
    }

    @ApiOperation("添加Redis连接")
    @PostMapping
    public RestResponse<RedisConnection> addUser(@RequestBody RedisConnectionAddRequest request) {
        String lockKey = Constant.PREVENT_RESUBMIT_LOCK_KEY_PREFIX + SERVICE_NAME + Constant.METHOD_ADD;
        RLock rLock = redissonClient.getLock(lockKey);
        try {
            boolean locked = rLock.tryLock(Constant.RLOCK_WAIT_MILLISECONDS, Constant.RLOCK_LEASE_MILLISECONDS, TimeUnit.MILLISECONDS);
            if (locked) {
                return redisConnectionService.add(request);
            }
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        } catch (Exception e) {
            log.info("新增Redis连接失败：{}", e);
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        } finally {
            rLock.unlock();
        }
    }

    @ApiOperation("修改Redis连接")
    @PutMapping
    public RestResponse<RedisConnection> update(@RequestBody RedisConnectionUpdateRequest request) {
        String lockKey = Constant.PREVENT_RESUBMIT_LOCK_KEY_PREFIX + SERVICE_NAME + Constant.METHOD_EDIT;
        RLock rLock = redissonClient.getLock(lockKey);
        try {
            boolean locked = rLock.tryLock(Constant.RLOCK_WAIT_MILLISECONDS, Constant.RLOCK_LEASE_MILLISECONDS, TimeUnit.MILLISECONDS);
            if (locked) {
                return redisConnectionService.update(request);
            }
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        } catch (Exception e) {
            log.error("编辑Redis连接失败：{}", e);
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        }
    }

    @ApiOperation("删除Redis连接")
    @DeleteMapping(value = "/{id}")
    public RestResponse<RedisConnection> delete(@PathVariable(value = "id") Long id) {
        String lockKey = Constant.PREVENT_RESUBMIT_LOCK_KEY_PREFIX + SERVICE_NAME + Constant.METHOD_DELETE;
        RLock rLock = redissonClient.getLock(lockKey);
        try {
            boolean locked = rLock.tryLock(Constant.RLOCK_WAIT_MILLISECONDS, Constant.RLOCK_LEASE_MILLISECONDS, TimeUnit.MILLISECONDS);
            if (locked) {
                return redisConnectionService.delete(id);
            }
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        } catch (Exception e) {
            log.error("删除Redis连接失败：{}", e);
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        }
    }

    @ApiOperation("批量删除Redis连接")
    @DeleteMapping
    public RestResponse<RedisConnection> batchDelete(@RequestBody RedisConnectionDeleteRequest request) {
        String lockKey = Constant.PREVENT_RESUBMIT_LOCK_KEY_PREFIX + SERVICE_NAME + Constant.METHOD_BATCH_DELETE;
        RLock rLock = redissonClient.getLock(lockKey);
        try {
            boolean locked = rLock.tryLock(Constant.RLOCK_WAIT_MILLISECONDS, Constant.RLOCK_LEASE_MILLISECONDS, TimeUnit.MILLISECONDS);
            if (locked) {
                return redisConnectionService.batchDelete(request);
            }
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        } catch (Exception e) {
            log.error("删除Redis连接失败：{}", e);
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        }
    }

    @ApiOperation("测试Redis连接")
    @PostMapping("/test")
    public RestResponse<RedisConnection> test(@RequestBody RedisConnectionAddRequest request) {
        return redisConnectionService.ping(request);
    }
}
