./bin/cryptogen generate --config=./cryptogen.yaml
./bin/configtxgen -profile ThreeOrgsOrdererGenesis -outputBlock ./genesis.block
./bin/configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx ./channel.tx -channelID mychannel
