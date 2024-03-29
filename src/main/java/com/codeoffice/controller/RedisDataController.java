package com.codeoffice.controller;

import com.codeoffice.common.RestResponse;
import com.codeoffice.request.RedisDataQueryRequest;
import com.codeoffice.request.RedisDataRowUpdateRequest;
import com.codeoffice.request.RedisDataUpdateRequest;
import com.codeoffice.service.RedisDataService;
import com.codeoffice.utils.RedisOperationUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author: DongYanJun
 * @date: 2021/1/11 16:05
 */
@Api(value = "RedisData管理", tags = "RedisData管理")
@Slf4j
@RestController
@RequestMapping("/api/redisData")
public class RedisDataController {

    private RedisDataService redisDataService;

    @Autowired
    private RedisOperationUtil operationUtil;

    public RedisDataController(RedisDataService redisDataService) {
        this.redisDataService = redisDataService;
    }

    @ApiOperation("获取所有Redis连接列表")
    @GetMapping(value = "/database/{id}")
    public RestResponse database(@PathVariable("id") Long id) {
        return redisDataService.database(id);
    }

    @ApiOperation("获取所有Redis连接列表")
    @GetMapping(value = "/databaseSize")
    public RestResponse databaseSize(@ModelAttribute RedisDataQueryRequest request) {
        return redisDataService.databaseSize(request);
    }

    @ApiOperation("获取database下所有key")
    @GetMapping(value = "/keys")
    public RestResponse keys(@ModelAttribute RedisDataQueryRequest request) {
        return redisDataService.keysPages(request);
    }

    @ApiOperation("添加一个key")
    @PostMapping(value = "/addKey")
    public RestResponse addKey(@RequestBody RedisDataRowUpdateRequest request) {
        return redisDataService.addKey(request);
    }

    @ApiOperation("获取key属性")
    @GetMapping(value = "/getKeyAttr")
    public RestResponse getKeyAttr(@ModelAttribute RedisDataQueryRequest request) {
        return redisDataService.getKeyAttr(request);
    }

    @ApiOperation("key添加value")
    @PostMapping(value = "/addValue")
    public RestResponse addValue(@RequestBody RedisDataRowUpdateRequest request) {
        return redisDataService.addValue(request);
    }

    @ApiOperation("获取key对应value")
    @GetMapping(value = "/getValue")
    public RestResponse getValue(@ModelAttribute RedisDataQueryRequest request) {
        return redisDataService.getValue(request);
    }

    @ApiOperation("key更新value")
    @PostMapping(value = "/updateValue")
    public RestResponse updateValue(@RequestBody RedisDataRowUpdateRequest request) {
        return redisDataService.updateValue(request);
    }

    @ApiOperation("key删除value")
    @PostMapping(value = "/removeValue")
    public RestResponse removeValue(@RequestBody RedisDataRowUpdateRequest request) {
        return redisDataService.removeValue(request);
    }

    @ApiOperation("removeKey")
    @PostMapping(value = "/removeKey")
    public RestResponse removeKey(@RequestBody RedisDataUpdateRequest request) {
        return redisDataService.removeKey(request);
    }

    @ApiOperation("renameKey")
    @PostMapping(value = "/renameKey")
    public RestResponse renameKey(@RequestBody RedisDataUpdateRequest request) {
        return redisDataService.renameKey(request);
    }

    @ApiOperation("expire")
    @PostMapping(value = "/expire")
    public RestResponse expire(@RequestBody RedisDataUpdateRequest request) {
        return redisDataService.expire(request);
    }

    @ApiOperation("set key")
    @PostMapping(value = "/set")
    public RestResponse set(@RequestBody RedisDataRowUpdateRequest request) {
        return redisDataService.set(request);
    }

    @ApiOperation("获取database下所有key")
    @GetMapping(value = "/mget")
    public RestResponse mget(@ModelAttribute RedisDataQueryRequest request) {
        return redisDataService.keys(request);
    }

    @ApiOperation("test")
    @GetMapping(value = "/test")
    public RestResponse test(@ModelAttribute RedisDataQueryRequest request) {
        return RestResponse.success(operationUtil.hscan(request.getConnectionId(),request.getDatabaseId(),request.getKey()));
    }

}
