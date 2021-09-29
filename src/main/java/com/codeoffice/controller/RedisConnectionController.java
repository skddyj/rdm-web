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
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

/**
 * @author: DongYanJun
 * @date: 2021/1/11 16:05
 */
@Api(value = "RedisConnection管理", tags = "RedisConnection管理")
@Slf4j
@RestController
@RequestMapping("/api/redisConnection")
public class RedisConnectionController {

    private RedisConnectionService redisConnectionService;

    public RedisConnectionController(RedisConnectionService redisConnectionService) {
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
        return redisConnectionService.add(request);
    }

    @ApiOperation("修改Redis连接")
    @PutMapping
    public RestResponse<RedisConnection> update(@RequestBody RedisConnectionUpdateRequest request) {
        return redisConnectionService.update(request);
    }

    @ApiOperation("删除Redis连接")
    @DeleteMapping(value = "/{id}")
    public RestResponse<RedisConnection> delete(@PathVariable(value = "id") Long id) {
        return redisConnectionService.delete(id);
    }

    @ApiOperation("批量删除Redis连接")
    @DeleteMapping
    public RestResponse<RedisConnection> batchDelete(@RequestBody RedisConnectionDeleteRequest request) {
        return redisConnectionService.batchDelete(request);
    }

    @ApiOperation("查看Redis连接")
    @GetMapping("/print")
    public RestResponse print() {
        return redisConnectionService.print();
    }

    @ApiOperation("测试Redis连接")
    @PostMapping("/test")
    public RestResponse<RedisConnection> test(@RequestBody RedisConnectionAddRequest request) {
        return redisConnectionService.ping(request);
    }
}
