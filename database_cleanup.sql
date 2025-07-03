-- 数据库重复记录清理脚本
-- 注意：执行前请先备份数据库！

-- 1. 查找所有重复的钱包地址记录
SELECT 
  wallet_address, 
  COUNT(*) as count,
  STRING_AGG(id::text, ', ' ORDER BY create_time DESC) as ids,
  MIN(create_time) as first_created,
  MAX(create_time) as last_created
FROM users 
WHERE wallet_address IS NOT NULL 
GROUP BY wallet_address 
HAVING COUNT(*) > 1;

-- 2. 查看具体的重复记录详情（针对问题地址）
SELECT 
  id, 
  wallet_address, 
  name, 
  nickname,
  create_time,
  update_time
FROM users 
WHERE wallet_address = '0x8A5F7289AE958AB99Ca6a552Ac4164Ae8008247e'
ORDER BY create_time DESC;

-- 3. 安全清理重复记录的步骤

-- 步骤3.1：创建备份表
CREATE TABLE users_backup AS SELECT * FROM users;

-- 步骤3.2：删除重复记录，保留最新的记录
WITH duplicate_users AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY wallet_address ORDER BY create_time DESC) as rn
  FROM users
  WHERE wallet_address IS NOT NULL
)
DELETE FROM users 
WHERE id IN (
  SELECT id 
  FROM duplicate_users 
  WHERE rn > 1
);

-- 4. 清理相关的user_profiles表中的孤立记录
DELETE FROM user_profiles 
WHERE user_id NOT IN (SELECT id FROM users);

-- 5. 添加唯一约束防止将来出现重复
ALTER TABLE users 
ADD CONSTRAINT unique_wallet_address 
UNIQUE (wallet_address);

-- 6. 验证清理结果
SELECT 
  wallet_address, 
  COUNT(*) as count
FROM users 
WHERE wallet_address IS NOT NULL 
GROUP BY wallet_address 
HAVING COUNT(*) > 1;

-- 如果上面的查询没有返回结果，说明重复记录已清理完成 