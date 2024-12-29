const RouteInfo = ({ distance, duration, stops }) => (
    <View style={styles.routeInfoContainer}>
      <View style={styles.routeInfoHeader}>
        <Text style={styles.routeInfoTitle}>Route Details</Text>
      </View>
      <View style={styles.routeInfoContent}>
        <View style={styles.routeInfoItem}>
          <Text style={styles.routeInfoLabel}>Distance</Text>
          <Text style={styles.routeInfoValue}>{distance}</Text>
        </View>
        <View style={styles.routeInfoDivider} />
        <View style={styles.routeInfoItem}>
          <Text style={styles.routeInfoLabel}>Duration</Text>
          <Text style={styles.routeInfoValue}>{duration}</Text>
        </View>
        <View style={styles.routeInfoDivider} />
        <View style={styles.routeInfoItem}>
          <Text style={styles.routeInfoLabel}>Stops</Text>
          <Text style={styles.routeInfoValue}>{stops} locations</Text>
        </View>
      </View>
    </View>
  );