-- 授权转账记录表
CREATE TABLE IF NOT EXISTS authorized_transfers (
    id SERIAL PRIMARY KEY,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    transfer_id VARCHAR(50) UNIQUE NOT NULL,
    tx_hash VARCHAR(66),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    network_id INTEGER NOT NULL DEFAULT 97,
    contract_address VARCHAR(42),
    gas_fee DECIMAL(20, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_authorized_transfers_from_address ON authorized_transfers(from_address);
CREATE INDEX IF NOT EXISTS idx_authorized_transfers_status ON authorized_transfers(status);
CREATE INDEX IF NOT EXISTS idx_authorized_transfers_created_at ON authorized_transfers(created_at);
CREATE INDEX IF NOT EXISTS idx_authorized_transfers_tx_hash ON authorized_transfers(tx_hash);

-- 用户授权记录表 (记录用户对特定地址的授权状态)
CREATE TABLE IF NOT EXISTS user_authorizations (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    spender_address VARCHAR(42) NOT NULL,
    token_address VARCHAR(42) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    tx_hash VARCHAR(66) NOT NULL,
    network_id INTEGER NOT NULL DEFAULT 97,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_address, spender_address, token_address, network_id)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_authorizations_user_address ON user_authorizations(user_address);
CREATE INDEX IF NOT EXISTS idx_user_authorizations_spender ON user_authorizations(spender_address);
CREATE INDEX IF NOT EXISTS idx_user_authorizations_status ON user_authorizations(status);

-- 添加触发器自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_authorized_transfers_updated_at 
    BEFORE UPDATE ON authorized_transfers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_authorizations_updated_at 
    BEFORE UPDATE ON user_authorizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据 (测试用)
-- INSERT INTO authorized_transfers (from_address, to_address, amount, transfer_id, network_id) VALUES
-- ('0x742d35Cc6638C0532925a3b8D2B0A9A7C2F5F0eA', '0x05D19013fb66b2E36f7AA33a25920df439eFE7Ad', 100.00, 'test_001', 97);

-- 添加注释
COMMENT ON TABLE authorized_transfers IS '授权转账记录表，存储管理员执行的授权转账操作';
COMMENT ON TABLE user_authorizations IS '用户授权记录表，存储用户对智能合约的授权信息';

COMMENT ON COLUMN authorized_transfers.from_address IS '发送方钱包地址';
COMMENT ON COLUMN authorized_transfers.to_address IS '接收方钱包地址';  
COMMENT ON COLUMN authorized_transfers.amount IS '转账金额';
COMMENT ON COLUMN authorized_transfers.transfer_id IS '转账唯一标识';
COMMENT ON COLUMN authorized_transfers.tx_hash IS '区块链交易哈希';
COMMENT ON COLUMN authorized_transfers.status IS '转账状态: pending-待处理, completed-已完成, failed-失败';
COMMENT ON COLUMN authorized_transfers.network_id IS '网络ID: 56-BSC主网, 97-BSC测试网';
COMMENT ON COLUMN authorized_transfers.contract_address IS '智能合约地址';

COMMENT ON COLUMN user_authorizations.user_address IS '用户钱包地址';
COMMENT ON COLUMN user_authorizations.spender_address IS '被授权的消费者地址';
COMMENT ON COLUMN user_authorizations.token_address IS '代币合约地址';
COMMENT ON COLUMN user_authorizations.amount IS '授权金额';
COMMENT ON COLUMN user_authorizations.status IS '授权状态: active-有效, revoked-已撤销, expired-已过期'; 