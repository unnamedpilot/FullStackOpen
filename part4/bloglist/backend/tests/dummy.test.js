const { test, describe } = require('node:test')
const assert = require('node:assert')

const list_helper = require('../utils/list_helper')

describe('list_helper', () => {
    test("verify dummy", () =>{
        assert.strictEqual(list_helper.dummy([]), 1)
    })
})


