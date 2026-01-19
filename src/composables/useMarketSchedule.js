import timezoneData from '../data/timezones.json';
import marketsData from '../data/markets.json';

export const useMarketSchedule = (selectedTimezone) => {
  // Obtener información de la zona horaria
  const getTimezoneInfo = (tzId) => {
    return timezoneData.timezones.find(tz => tz.id === tzId);
  };

  // Calcular la hora actual en una zona horaria específica
  const getCurrentTimeInTimezone = (tzId) => {
    const tzInfo = getTimezoneInfo(tzId);
    if (!tzInfo) return null;

    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();

    // Calcular horas en la zona horaria del usuario
    let localHours = utcHours + tzInfo.offset;
    let localMinutes = utcMinutes;

    // Ajustar si se pasa de 24 horas
    if (localHours >= 24) {
      localHours -= 24;
    } else if (localHours < 0) {
      localHours += 24;
    }

    return {
      hours: Math.floor(localHours),
      minutes: localMinutes,
      totalMinutes: localHours * 60 + localMinutes
    };
  };

  // Parsear un tiempo "HH:MM" a minutos totales
  const parseTimeToMinutes = (timeStr) => {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + mins;
  };

  // Determinar si un mercado está abierto en la zona horaria del usuario
  const isMarketOpen = (market, tzId) => {
    if (market.timezone === '24H') return true; // Crypto abierto siempre

    const currentTime = getCurrentTimeInTimezone(tzId);
    if (!currentTime) return false;

    const openMinutes = parseTimeToMinutes(market.openTime);
    const closeMinutes = parseTimeToMinutes(market.closeTime);

    // Si el mercado no cruza medianoche
    if (openMinutes < closeMinutes) {
      return currentTime.totalMinutes >= openMinutes && currentTime.totalMinutes < closeMinutes;
    }
    // Si el mercado cruza medianoche (ej: 22:00 - 08:00)
    return currentTime.totalMinutes >= openMinutes || currentTime.totalMinutes < closeMinutes;
  };

  // Obtener todos los mercados abiertos para una zona horaria
  const getActiveMarkets = () => {
    if (!selectedTimezone.value) return [];

    const allMarkets = marketsData.markets;
    return allMarkets
      .filter(market => isMarketOpen(market, selectedTimezone.value))
      .map(market => ({
        ...market,
        isOpen: true
      }));
  };

  // Obtener todos los mercados con estado (abiertos/cerrados)
  const getAllMarketsWithStatus = () => {
    if (!selectedTimezone.value) return [];

    const allMarkets = marketsData.markets;
    return allMarkets.map(market => ({
      ...market,
      isOpen: isMarketOpen(market, selectedTimezone.value)
    }));
  };

  // Obtener los mejores assets de un mercado (top 10 ya ordenados)
  const getTopAssetsForMarket = (market, limit = 10) => {
    if (!market || !market.assetsByType) return [];

    const allAssets = [];

    // Recopilar todos los assets del mercado
    Object.keys(market.assetsByType).forEach(assetType => {
      market.assetsByType[assetType].forEach(asset => {
        allAssets.push({
          ...asset,
          assetType
        });
      });
    });

    // Ordenar por volatilidad descendente
    allAssets.sort((a, b) => b.volatility - a.volatility);

    // Retornar top N (default 10)
    return allAssets.slice(0, limit);
  };

  // Obtener solo los top 4 assets más volatiles (2 principales + 2 secundarios)
  const getTopFourAssets = (market) => {
    return getTopAssetsForMarket(market, 4);
  };

  // Obtener próxima sesión que abre
  const getNextOpeningMarket = () => {
    if (!selectedTimezone.value) return null;

    const currentTime = getCurrentTimeInTimezone(selectedTimezone.value);
    if (!currentTime) return null;

    const allMarkets = marketsData.markets;
    let nextMarket = null;
    let minDiff = Infinity;

    allMarkets.forEach(market => {
      if (market.timezone !== '24H') {
        const openMinutes = parseTimeToMinutes(market.openTime);
        let diff = 0;

        if (openMinutes > currentTime.totalMinutes) {
          diff = openMinutes - currentTime.totalMinutes;
        } else {
          // Mercado abre mañana
          diff = (1440 - currentTime.totalMinutes) + openMinutes;
        }

        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          nextMarket = market;
        }
      }
    });

    if (nextMarket && minDiff !== Infinity) {
      const hours = Math.floor(minDiff / 60);
      const minutes = minDiff % 60;
      return {
        market: nextMarket,
        hoursUntilOpen: hours,
        minutesUntilOpen: minutes,
        timeString: `${hours}h ${minutes}min`
      };
    }

    return null;
  };

  return {
    getTimezoneInfo,
    getCurrentTimeInTimezone,
    isMarketOpen,
    getActiveMarkets,
    getAllMarketsWithStatus,
    getTopAssetsForMarket,
    getTopFourAssets,
    getNextOpeningMarket,
    parseTimeToMinutes
  };
};
