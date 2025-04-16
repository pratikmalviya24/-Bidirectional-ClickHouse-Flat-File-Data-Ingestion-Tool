-- Create the trips table
CREATE TABLE IF NOT EXISTS trips (
    trip_id UInt64,
    vendor_id String,
    pickup_datetime DateTime,
    dropoff_datetime DateTime,
    passenger_count UInt8,
    trip_distance Float64,
    pickup_longitude Float64,
    pickup_latitude Float64,
    rate_code_id UInt8,
    store_and_fwd_flag String,
    dropoff_longitude Float64,
    dropoff_latitude Float64,
    payment_type String,
    fare_amount Float64,
    extra Float64,
    mta_tax Float64,
    tip_amount Float64,
    tolls_amount Float64,
    improvement_surcharge Float64,
    total_amount Float64
) ENGINE = MergeTree()
ORDER BY (pickup_datetime, dropoff_datetime);

-- Load sample data from S3
INSERT INTO trips
SELECT *
FROM s3('https://datasets-documentation.s3.eu-west-3.amazonaws.com/nyc-taxi/trips_0.csv',
    'CSV',
    'trip_id UInt64, vendor_id String, pickup_datetime DateTime, dropoff_datetime DateTime, passenger_count UInt8, trip_distance Float64, pickup_longitude Float64, pickup_latitude Float64, rate_code_id UInt8, store_and_fwd_flag String, dropoff_longitude Float64, dropoff_latitude Float64, payment_type String, fare_amount Float64, extra Float64, mta_tax Float64, tip_amount Float64, tolls_amount Float64, improvement_surcharge Float64, total_amount Float64'); 